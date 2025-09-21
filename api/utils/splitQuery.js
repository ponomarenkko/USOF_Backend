export default async function splitQuery(query) {
	return query
		?.split(`],`)
		.map((fullParam, i, arr) =>
			fullParam[fullParam.length - 1] !== "]" && arr.length - 1 !== i
				? fullParam + `]`
				: fullParam,
		);
}
