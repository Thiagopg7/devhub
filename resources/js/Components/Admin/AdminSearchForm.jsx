import { FaSearch } from 'react-icons/fa';
import Input from '@/Components/Admin/Input';
import Label from '@/Components/Admin/Label';

export default function AdminSearchForm({ value, onChange, onSubmit, placeholder = '' }) {
    return (
        <form onSubmit={onSubmit} className="mb-4">
            <div className="w-full mb-4">
                <Label htmlFor="q" value="Pesquisa" className="!font-semibold !text-base" />
                <div className="flex gap-4 items-center">
                    <Input
                        id="q"
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        className="border-gray-300 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 mt-1 block w-full"
                    />
                    <button type="submit" className="bg-red-600 py-2 px-4 rounded-md text-white">
                        <FaSearch />
                    </button>
                </div>
            </div>
        </form>
    );
}
