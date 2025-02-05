export const isValidEmail = (email : string) : boolean => {
	return /^\S+@\S+\.\S+$/.test(email);
}

export const isValidName = (name : string) : boolean => {
	return /^[\p{L}'][ \p{L}'-]*\p{L}$/u.test(name);
}