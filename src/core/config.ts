export interface Config {
	PORT: string
	ENVIRONMENT: string
	DB: {
		url: string
		options: {
			useNewUrlParser: boolean
			useUnifiedTopology: boolean
		}
	}
}

export const config: Config = {
	PORT: (process.env.PORT as string) || '3000',
	ENVIRONMENT: (process.env.ENVIRONMENT as string) || 'development',
	DB: {
		url: (process.env.DBURL as string) || '',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	}
}
