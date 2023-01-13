import mongoose, { ConnectOptions } from 'mongoose'

export class database {
	private url: string
	private options: ConnectOptions
	constructor(url: string, options: object) {
		this.url = url
		this.options = options as ConnectOptions
	}

	connect() {
		mongoose.connect(this.url, this.options)
		return mongoose.connection
	}
}
