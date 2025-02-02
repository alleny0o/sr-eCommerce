import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import { OptionExtension } from "../../../../types/option-extension";

type ColorPickerProps = {
    updatedOptionExtension: OptionExtension;
    setUpdatedOptionExtension: (updatedOptionExtension: OptionExtension) => void;
    index: number;
};

const ColorPickerComponent = (input: ColorPickerProps) => {
    const { updatedOptionExtension, setUpdatedOptionExtension, index } = input;

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>('bottom');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const pickerRef = useRef<HTMLDivElement | null>(null);

    const color = updatedOptionExtension.option_variations[index].color;

    const handleChange = (color: any) => {
        if (updatedOptionExtension) {
            const newOptionVariations = [...updatedOptionExtension.option_variations];
            newOptionVariations[index] = {
                ...newOptionVariations[index],
                color: color.hex,
            };
    
            const newOptionExtension = {
                ...updatedOptionExtension,
                option_variations: newOptionVariations,
            };
    
            setUpdatedOptionExtension(newOptionExtension);
        }
    };

    const togglePicker = () => {
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;

            setPickerPosition(spaceBelow < 300 && spaceAbove > 300 ? 'top' : 'bottom');
        }
        setShowColorPicker((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            pickerRef.current &&
            !pickerRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setShowColorPicker(false);
        }
    };

    useEffect(() => {
        if (showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showColorPicker]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={togglePicker}
                className={`flex items-center justify-center w-[40px] h-[40px] rounded-full border-2 
                    ${color ? 'border-gray-500 dark:border-gray-300' : 'border-dashed border-gray-500 dark:border-gray-200'}`}
                style={{
                    backgroundColor: color || 'transparent',
                }}
            >
                {!color && (
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-200"></span>
                )}
            </button>
            {showColorPicker && (
                <div
                    ref={pickerRef}
                    className={`absolute z-10 ${
                        pickerPosition === 'top' ? 'bottom-[calc(100%+8px)]' : 'mt-2'
                    }`}
                >
                    <ChromePicker
                        color={color || undefined}
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
};

export const ColorPicker = React.memo(ColorPickerComponent);
