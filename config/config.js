let env = process.env.NODE_ENV || 'development';
console.log('*****env', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/tld'
} else if (env === 'test' || env === 'test-client') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/gridfstest'
    console.log('MONGODB TEST');
}