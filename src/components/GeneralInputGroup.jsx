const GeneralInputGroup = ({ placeholder, type, name, value = '', onChange }) => {
    return (
        <div className='flex flex-col gap-2 w-full'>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                className='outline-none border border-[#105D8D] py-3 rounded px-2 w-full'
            />
        </div>
    );
};

export default GeneralInputGroup;