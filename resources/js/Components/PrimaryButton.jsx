export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={

                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out ${
                    disabled ? 'opacity-25' : ''
                } ` +
                ` bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ` +
                `dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-400 dark:focus:ring-gray-700 dark:focus:ring-offset-slate-900 ` +
                className

/*                `inline-flex items-center rounded-md border border-transparent bg-gray-800 dark:bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 dark:hover:bg-blue-700 focus:bg-gray-700 dark:focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 dark:active:bg-blue-800 ${
                    disabled && "opacity-25"
                }  ` + className*/

            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
