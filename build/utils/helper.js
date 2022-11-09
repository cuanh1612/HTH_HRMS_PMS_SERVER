"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSETime = exports.CreateProjectActivity = exports.compareDateTime = void 0;
const Project_entity_1 = require("../entities/Project.entity");
const Project_Activity_entity_1 = require("../entities/Project_Activity.entity");
// compare time
const compareDateTime = (date1, date2, inClock, outClock) => {
    if (new Date(date1) == new Date(date2)) {
        const inClockSplit = inClock.split(' ');
        const outClockSplit = outClock.split(' ');
        if (inClockSplit[1] == 'PM' && outClockSplit[1] == 'AM') {
            return true;
        }
        const timeInClock = inClockSplit[0].split(':');
        const timeOutClock = outClockSplit[0].split(':');
        if (Number(timeInClock[0]) >= Number(timeOutClock[0])) {
            return true;
        }
        if (timeInClock[0] == timeOutClock[0] &&
            timeOutClock[1] <= timeInClock[1] &&
            inClockSplit[1] == 'PM' &&
            outClockSplit[1] == 'AM') {
            return true;
        }
    }
    if (new Date(date1) > new Date(date2)) {
        return true;
    }
    return false;
};
exports.compareDateTime = compareDateTime;
//Project Activity Notification
const CreateProjectActivity = (res, projectId, content) => __awaiter(void 0, void 0, void 0, function* () {
    if (!projectId && content)
        return res.status(400).json({
            code: 400,
            status: false,
            message: 'Please enter full fields',
        });
    const existingProject = yield Project_entity_1.Project.findOne({
        where: {
            id: Number(projectId),
        },
    });
    if (!existingProject)
        return res.status(400).json({
            code: 400,
            status: false,
            message: 'Project does not existing in the system',
        });
    const currentDate = new Date();
    const time = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    const projectActivity = yield Project_Activity_entity_1.Project_Activity.create({
        project: existingProject,
        content,
        time,
    }).save();
    const listOfActivity = yield Project_Activity_entity_1.Project_Activity.find({
        where: {
            project: {
                id: existingProject.id,
            },
        },
        order: {
            createdAt: 'DESC',
        },
    });
    //remove oldest item of activities list when have over 100 items
    if (Array.isArray(listOfActivity) && listOfActivity.length > 100) {
        yield listOfActivity[0].remove();
    }
    return projectActivity;
});
exports.CreateProjectActivity = CreateProjectActivity;
// return start time and end time of month to filter in postgres
const getSETime = (value) => {
    const date = new Date(value);
    const firstDate = new Date(date.setDate(1));
    let lastDate = new Date(new Date((date.setMonth(date.getMonth() + 1))).setDate(0));
    const currentDate = new Date();
    if (currentDate.getTime() >= firstDate.getTime() && currentDate.getTime() < lastDate.getTime()) {
        lastDate = currentDate;
    }
    return {
        firstTime: `${firstDate.getFullYear()}-${firstDate.getMonth() + 1}-1`,
        lastTime: `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}-${lastDate.getDate()}`,
        firstTimeDate: firstDate,
        lastTimeDate: lastDate,
        lastDate: lastDate.getDate()
    };
};
exports.getSETime = getSETime;
