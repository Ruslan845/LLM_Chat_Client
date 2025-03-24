"use client"

import React, { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Check, ChevronsUpDown, LucideProps, Shuffle } from "lucide-react"
import { ScrollArea } from "./scroll-area"
import { ButtonExt } from "./button-ext"

interface optionType {
  title: string
  description: string
  icon: React.FC<LucideProps>
}
interface ComboboxExtProps {
  options: optionType[]
  onFilterChange: (value: string) => void
  value?: string | undefined
  disabledStyle?: boolean
}

const ComboboxExt = ({
  options,
  onFilterChange,
  value,
  disabledStyle,
}: ComboboxExtProps) => {
  const [open, setOpen] = useState(false)
  const [buttonValue, setButtonValue] = useState<string>(value ? value : "")
  const [InputIcon, setInputIcon] = useState<React.FC<LucideProps>>(Shuffle)
  useEffect(() => {
    setButtonValue(value ?? "")
  }, [value])

  const selectButton = (e: string, icon: React.FC<LucideProps>) => {
    setButtonValue(e)
    setOpen(false)
    onFilterChange(e)
    setInputIcon(icon)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonExt
          disabled={disabledStyle}
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="flex items-center bg-gray-700 px-4 py-2 rounded-3xl text-white hover:bg-gray-600 !border-none"
        >
          <div className="w-20 overflow-hidden text-left flex items-center gap-2">
            <InputIcon size={18} className="text-white" />
            {buttonValue}
          </div>
          <ChevronsUpDown className=" opacity-50" />
        </ButtonExt>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-700" align="start">
        <ScrollArea className={options.length > 5 ? `h-[200px]` : `h-auto`}>
          {options.length !== 0 ? (
            options.map((item: optionType, index: number) => {
              if (item) {
                const Icon = item.icon
                return (
                  <div className="m-1" key={index}>
                    <ButtonExt
                      className="w-full bg-transparent hover:bg-gray-600 text-white justify-between !border-none"
                      variant={"outline"}
                      value={item.title}
                      onClick={() => selectButton(item.title, item.icon)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={18} className="text-white" />
                        <div>
                          <span className=" float-start">{item.title}</span><br/>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </div>
                      <Check
                        className={
                          buttonValue === item.title ? " opacity-100" : "opacity-0"
                        }
                      />
                    </ButtonExt>
                  </div>
                )
              }
            })
          ) : (
            <div className="py-4 text-center">No Search found</div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxExt
