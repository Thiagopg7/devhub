import TextareaAutosize from 'react-textarea-autosize';
import Input from '@/Components/Admin/Input';
import Label from '@/Components/Admin/Label';

export default function SeoFields({
    metaTitle,
    metaDescription,
    onChangeTitle,
    onChangeDescription,
    titlePlaceholder = 'Deixe em branco para usar o título',
    disabled = false,
    descriptionMinRows = 2,
    descriptionMaxRows = 8,
    descriptionPlaceholder = '',
    showCharCount = false,
}) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label htmlFor="meta_title" value="Meta título" />
                <Input
                    id="meta_title"
                    type="text"
                    value={metaTitle}
                    className="mt-1 block w-full"
                    placeholder={titlePlaceholder}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    disabled={disabled}
                />
            </div>
            <div>
                <Label htmlFor="meta_description" value="Meta descrição" />
                <TextareaAutosize
                    id="meta_description"
                    value={metaDescription}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                    minRows={descriptionMinRows}
                    maxRows={descriptionMaxRows}
                    placeholder={descriptionPlaceholder}
                    onChange={(e) => onChangeDescription(e.target.value)}
                    disabled={disabled}
                />
                {showCharCount && (
                    <p className="mt-1 text-xs text-gray-400">{metaDescription?.length ?? 0}/500</p>
                )}
            </div>
        </div>
    );
}
