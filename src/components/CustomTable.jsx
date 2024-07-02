
const CustomTable = ({ columns, data }) => {
    const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr))`;

    return (
        <div className="container mx-auto mt-10 overflow-x-auto">
            <div className="min-w-max">
                <div className="grid" style={{ gridTemplateColumns }}>
                    {columns.map((column, index) => (
                        <div key={index} className="bg-[#1976D2] text-white py-6 px-4">{column.label}</div>
                    ))}
                </div>
                <div className="h-100 min-w-max">
                    {data.map((item) => (
                        <div key={item.id} className="grid" style={{ gridTemplateColumns }}>
                            {columns.map((column, index) => (
                                <div key={index} className="py-2 px-4 border-b">{item[column.key]}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomTable;
