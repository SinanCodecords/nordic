/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (name: string, value: string, days: number = 30) => {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;

	// Secure cookies are dropped on plain http (local dev), so only add it on https.
	const secure = window.location.protocol === "https:" ? "; Secure" : "";

	document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax${secure}`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}

	return null;
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
