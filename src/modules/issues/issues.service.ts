import { pool } from "../../db";
import type { TIssue } from "./issues.interface";

const createIssueIntoDB = async (payload: TIssue, reporterId: number) => {
    const { title, description, type } = payload;

    if (title.length > 150) {
        throw new Error("Title maximum 150 characters");
    }

    if (description.length < 20) {
        throw new Error("Description minimum 20 characters");
    }

    const query = `
    INSERT INTO issues(title, description, type, reporter_id)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;

    const values = [
        title,
        description,
        type,
        reporterId,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const getAllIssuesFromDB = async (
    sort = "newest",
    type?: string,
    status?: string
) => {
    let query = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query +=
        sort === "oldest"
            ? ` ORDER BY created_at ASC`
            : ` ORDER BY created_at DESC`;

    const issuesResult = await pool.query(query, values);

    const issues = issuesResult.rows;

    const reporterIds = [
        ...new Set(issues.map((issue) => issue.reporter_id)),
    ];

    const usersResult = await pool.query(`
        SELECT id, name, role FROM users
        WHERE id = ANY($1)
        `, [reporterIds]);

    const users = usersResult.rows;

    const formattedIssues = issues.map((issue) => {
        const reporter = users.find(
            (user) => user.id === issue.reporter_id
        );

        return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        };
    });

    return formattedIssues;
};

const getSingleIssueFromDB = async (id: number) => {
    const issueResult = await pool.query(`
    SELECT * FROM issues
    WHERE id = $1
    `, [id]);
    const issue = issueResult.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }


    const userResult = await pool.query(`
        SELECT id, name, role FROM users
        WHERE id = $1
        `, [issue.reporter_id]);

    const reporter = userResult.rows[0];

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
        },
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};

const updateIssueFromDB = async (id: number, payload: any, user: any) => {
    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );

    const issue = issueResult.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

    // contributor restriction
    if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
            throw new Error("You cannot update this issue");
        }

        if (issue.status !== "open") {
            throw new Error("You can only update open issues");
        }
    }

    const updatedTitle = payload.title || issue.title;
    const updatedDescription =
        payload.description || issue.description;
    const updatedType = payload.type || issue.type;

    const result = await pool.query(
        `
    UPDATE issues
    SET title = $1,
        description = $2,
        type = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
        [updatedTitle, updatedDescription, updatedType, id]
    );

    return result.rows[0];
};

const deleteIssueFromDB = async (id: number) => {
    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );

    if (!issueResult.rows[0]) {
        throw new Error("Issue not found");
    }

    await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);

    return null;
};

export const IssueServices = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueFromDB,
    deleteIssueFromDB,
};