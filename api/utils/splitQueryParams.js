export default function splitQueryParams(fullParam) {
	let [param, ...values] = fullParam?.split(`[`);
	values = values.join(`[`);

	if (values) {
		if (values[values.length - 1] !== `]`) throw new Error();

		values = values.slice(0, -1);
	}

	return [param, values];
}
