import {connect, ConnectOptions} from 'mongoose';

export const  dbConnect = () => {
    connect(process.env.MONGODB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log('Connection Establish'),
        (error) => console.log(error)
    )
}