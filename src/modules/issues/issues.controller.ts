import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IssueServices } from "./issues.service";

const createIssue = catchAsync(async (req, res) => {
    const reporterId = req.user?.id;

    const result = await IssueServices.createIssueIntoDB(
        req.body,
        reporterId
    );

    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: "Issue created successfully",
        data: result,
    });
});

const getAllIssues = catchAsync(async (req, res) => {
    const { sort, type, status } = req.query;

    const result = await IssueServices.getAllIssuesFromDB(
        sort as string,
        type as string,
        status as string
    );

    sendResponse(res, StatusCodes.OK, {
        success: true,
        data: result,
    });
});

const getSingleIssue = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return sendResponse(res, 400, {
            success: false,
            message: "Invalid issue id",
        });
    }

    const result = await IssueServices.getSingleIssueFromDB(id);

    sendResponse(res, 200, {
        success: true,
        data: result,
    });
});

const updateIssue = catchAsync(async (req, res) => {
    const id = Number(req.params.id);

    const result = await IssueServices.updateIssueFromDB(id, req.body, req.user);

    sendResponse(res, 200, {
        success: true,
        message: "Issue updated successfully",
        data: result,
    });
});


const deleteIssue = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    await IssueServices.deleteIssueFromDB(id);
    sendResponse(res, 200, {
        success: true,
        message: "Issue deleted successfully",
    });
})

export const IssueControllers = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};