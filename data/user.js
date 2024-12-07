import bcrypt from 'bcryptjs';
 const users=[
    {
        name:"Admin User",
        email:"admin@gmail.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:"Jane Smith",
        email:"jane@gmail.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:false
    },
    {
        name:"Harvey Smith",
        email:"harvey@gmail.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
 ];
 export default users;