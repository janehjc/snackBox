var encrypt = function () {
	var secretKey = "1!QAZ2@WSXCDE#3$4RFVBGT%5^6YHNMJU7&8*IK<.LO9(0P";
	var ivKey = "12481632";
	var encryptByDES = function encryptByDES(message) {
		var keyHex = CryptoJS.enc.Utf8.parse(secretKey);
		var ivHex = CryptoJS.enc.Utf8.parse(ivKey);
		var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
			iv: ivHex,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7 });
		return encrypted.toString();
	};
	var decryptByDES = function decryptByDES(ciphertext) {
		var keyHex = CryptoJS.enc.Utf8.parse(secretKey);
		var ivHex = CryptoJS.enc.Utf8.parse(ivKey);
		var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
			iv: ivHex,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	};

	return {
		encryptByDES: encryptByDES,
		decryptByDES: decryptByDES
	};
}();