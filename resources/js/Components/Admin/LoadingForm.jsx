export default function LoadingForm() {
    return (
        <div className="flex flex-row gap-1 items-center">
            <div className="text-base text-gray-500 whitespace-nowrap">Carregando</div>
            <div className="la-ball-pulse-sync la-dark la-sm whitespace-nowrap">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
