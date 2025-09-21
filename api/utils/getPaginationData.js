export default function (data, page, size) {
    const { count: totalRecords, rows: items } = data
    const totalPages = Math.ceil(totalRecords / size );
    const currentRecords = items.length
    const metadata = {
        currentPage: parseInt(page),
        currentRecords,
        totalPages,
        totalRecords,
}

    return { metadata, items }
}