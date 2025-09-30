
export default function LoginValidation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Email
    if(values.email === ""){
        error.email = "กรุณากรอก Email ที่ได้ลงทะเบียน"
    } else if(!email_pattern.test(values.email)){
        error.email = "ไม่พบ Email นี้"
    }

    // Password
    if(values.password === ""){
        error.password = "กรุณากรอก Password"
    } else if(!password_pattern.test(values.password)){
        error.password = "ไม่พบ Password นี้"
    }

    return error;
}

