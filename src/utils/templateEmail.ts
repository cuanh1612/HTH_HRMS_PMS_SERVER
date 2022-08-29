import fs from 'fs'
import { resolve } from 'path'
import { Company_Info } from '../entities/Company_Info'

const templateBasic = async ({
	file,
	handleBody,
	name,
}: {
	file: string
	handleBody: any
	name: string
}) => {
	const companyInfo = (await Company_Info.find({}))[0]
	fs.writeFileSync(resolve(__dirname, file), '')
	fs.readFileSync(resolve(__dirname, '../../views/common/header.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	// set link to go main page
	fs.appendFileSync(resolve(__dirname, file), `href="${process.env.CLIENT_URL}"` + '\n')
	fs.readFileSync(resolve(__dirname, '../../views/common/element2.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(
		resolve(__dirname, file),
		`src = '${
			companyInfo.logo_url ||
			'https://res.cloudinary.com/hoang161201/image/upload/v1661758934/image/icon-192x192_gfnav2.png'
		}'` + '\n'
	)
	fs.readFileSync(resolve(__dirname, '../../views/common/element3.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(resolve(__dirname, file), `${companyInfo.name}` + '\n')
	fs.readFileSync(resolve(__dirname, '../../views/common/element4.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(resolve(__dirname, file), `${name}` + '\n')
	fs.readFileSync(resolve(__dirname, '../../views/common/element5.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})

	handleBody()
	fs.readFileSync(resolve(__dirname, '../../views/common/element8.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(resolve(__dirname, file), `${companyInfo.name}` + '\n')

	fs.readFileSync(resolve(__dirname, '../../views/common/element9.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(
		resolve(__dirname, file),
		`href="https://www.facebook.com/hoang.nguyenquang.395454/"` + '\n'
	)
	fs.readFileSync(resolve(__dirname, '../../views/common/element10.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(
		resolve(__dirname, file),
		`href="https://www.facebook.com/profile.php?id=100014461876748"` + '\n'
	)
	fs.readFileSync(resolve(__dirname, '../../views/common/element11.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
	fs.appendFileSync(
		resolve(__dirname, file),
		`href="https://www.facebook.com/profile.php?id=100006706506739"` + '\n'
	)
	fs.readFileSync(resolve(__dirname, '../../views/common/element12.txt'))
		.toString()
		.split('\n')
		.forEach(function (line) {
			fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
		})
}

export const templateWEmail = async ({
	activeToken,
	name,
	file,
}: {
	activeToken: string
	name: string
	file: string
}) => {
	const handleBody = () => {
		fs.readFileSync(resolve(__dirname, '../../views/common/element13.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), `href="${activeToken}"` + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element6.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), `href="${activeToken}"` + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element7.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), activeToken + '\n')
	}

	templateBasic({
		file,
		handleBody,
		name,
	})
}

export const templateInterview = async ({
	position,
	name,
	file,
	time,
}: {
	position: string
	name: string
	file: string
	time: string
}) => {
	const companyInfo = (await Company_Info.find({}))[0]
	const handleBody = async () => {
		fs.readFileSync(resolve(__dirname, '../../views/common/element14.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), position + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element15.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), companyInfo.name + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element16.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), companyInfo.name + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element17.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), time + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element18.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), companyInfo.name + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element19.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
		fs.appendFileSync(resolve(__dirname, file), name + '\n')
		fs.readFileSync(resolve(__dirname, '../../views/common/element20.txt'))
			.toString()
			.split('\n')
			.forEach(function (line) {
				fs.appendFileSync(resolve(__dirname, file), line.toString() + '\n')
			})
	}

	templateBasic({
		file: file,
		handleBody,
		name,
	})
}
