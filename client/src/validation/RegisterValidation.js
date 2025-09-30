
export default function RegisterValidation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Name
    if(values.name === ""){
        error.name = "กรุณากรอกชื่อผู้ลงทะเบียน"
    }

    // Email
    if(values.email === ""){
        error.email = "กรุณากรอก Email"
    } else if(!email_pattern.test(values.email)){
        error.email = "ไม่พบ Email นี้"
    }

    // Password
    if(values.password === ""){
        error.password = "กรุณากรอก Password"
    } else if(!password_pattern.test(values.password)){
        error.password = "ไม่พบ Password นี้"
    }

    // Confirm Password
    if(values.confirmpassword === ""){
        error.confirmpassword = "กรุณากรอก Confirm Password"
    } else if(values.confirmpassword !== values.password){
        error.confirmpassword = "Confirm Password ไม่ตรงกับ Password"
    }

    return error;
}

