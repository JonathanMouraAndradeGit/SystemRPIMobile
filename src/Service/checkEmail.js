export default function checkEmail(form) {
    return !form.email.includes("@") ||
        form.email.indexOf("@") !== form.email.lastIndexOf("@") ||
        !form.email.split("@")[1].includes(".") ||
        form.email.split("@")[1].startsWith(".") ||
        form.email.split("@")[1].endsWith(".")
}