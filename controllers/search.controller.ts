import { Request, Response } from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import City from "../models/city.model";

export const search = async (req: Request, res: Response) => {

    console.log(req.query)
    console.log(req.query.language)
    console.log(req.query.city)

    const dataFinal = [];
    let totalPage = 0;
    let totalRecord = 0;

    if (Object.keys(req.query).length > 0) {
        // language
        const find: any = {};
        if (req.query.language) {
            find.technologies = new RegExp(`${req.query.language}`, "i");
        }

        //Company
        if (req.query.company) {
            const company = await AccountCompany
                .findOne({
                    companyName: req.query.company
                })

            find.companyId = company?.id
        }

        // City 
        if (req.query.city) {
            const city = await City
                .findOne({
                    name: req.query.city
                })

            if (city) {
                const listAccountInCity = await AccountCompany
                    .find({
                        city: city.id
                    })

                const listIdAccountInCity = listAccountInCity.map(item => item.id)

                find.companyId = { $in: listIdAccountInCity };
            }
        }
        //Keyword
        if (req.query.keyword) {
            const keywordRegex = new RegExp(`${req.query.keyword}`, "i");
            find["$or"] = [
                { title: keywordRegex },
                { technologies: keywordRegex }
            ];
        }

        // Position
        if (req.query.position) {
            find.position = new RegExp(`${req.query.position}`, "i");
        };
        if (req.query.working) {
            find.workingForm = new RegExp(`${req.query.working}`, "i");
        }

        // Phân trang
        const limitItems = 2;
        let page = 1;
        if (req.query.page) {
            const currentPage = parseInt(`${req.query.page}`);
            if (currentPage > 0) {
                page = currentPage;
            }
        }
        totalRecord = await Job.countDocuments(find);
        totalPage = Math.ceil(totalRecord / limitItems);
        if (page > totalPage && totalPage != 0) {
            page = totalPage;
        }
        const skip = (page - 1) * limitItems;
        // Hết Phân trang



        console.log("find:", find)
        const jobs = await Job
            .find(find)
            .sort({
                createdAt: "desc"
            })
            .limit(limitItems)
            .skip(skip)

        for (const item of jobs) {
            const itemFinal = {
                id: item.id,
                companyLogo: "",
                companyName: "",
                title: item.title,
                salaryMin: item.salaryMin,
                salaryMax: item.salaryMax,
                position: item.position,
                workingForm: item.workingForm,
                companyCity: "",
                technologies: item.technologies,
            }
            const companyInfo = await AccountCompany
                .findOne({
                    _id: item.companyId
                })
            if (companyInfo) {
                itemFinal.companyLogo = `${companyInfo.logo}`;
                itemFinal.companyName = `${companyInfo.companyName}`

                const city = await City
                    .findOne({
                        _id: companyInfo.city
                    })
                itemFinal.companyCity = `${city?.name}`
            }
            dataFinal.push(itemFinal)
            console.log(dataFinal)

        }
    }
    res.json({
        code: "success",
        message: "Thành công!",
        jobs: dataFinal,
        totalPage: totalPage,
        totalRecord: totalRecord
    })
}