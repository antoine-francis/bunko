export const getCookie = (name: string) : string => {
	const cookie = document.cookie.split(';').map(c => c.trim()).filter(c => c.startsWith(name + "="));
	if (!cookie) return "";
	return cookie[0].split("=")[1];
}