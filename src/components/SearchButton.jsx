
import SearchIcon from '../assets/search.png'

const SearchButton = () => {
  return (
    <button className='bg-[#1AB7C1] rounded-lg px-8 py-4'>
        <img src={SearchIcon} className='w-[100px]'/>
    </button>
  )
}

export default SearchButton