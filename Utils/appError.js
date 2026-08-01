class APPError extends Error {
    constructor(message,statusCode) {
        // عشان اورث الماسدج من اوبجيكت الايرور نفسه
        super(message);
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith('4')?'fail':'error';
        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor)
    }  
}

module.exports=APPError;