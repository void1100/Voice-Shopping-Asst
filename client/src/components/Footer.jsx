import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600">
                            <FaMicrophone className="text-[10px] text-white" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-slate-400">
                            &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-slate-200">Adish Hussain</span> - Built by Adish Hussain
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                            Voice-powered
                        </span>
                        <span>|</span>
                        <span>Multilingual support</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
