import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Image from "next/image"

import React from 'react'

interface EmptyStateProps {
    imgSrc: string;
    title: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

const EmptyState = ({
    imgSrc,
    title,
    description,
    buttonText,
    onButtonClick
}: EmptyStateProps) => {
  return (
    <Empty className="border border-dashed bg-white h-100">
        <EmptyHeader>
            <EmptyMedia variant="default">
                <Image height={100} width={100} src={imgSrc} alt='no-business-state' />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>
                {description}
            </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            {buttonText && (
                <Button className='bg-[#1E3A8A] text-white cursor-pointer' size="default">
                    {buttonText}
                </Button>
            )}
        </EmptyContent>
    </Empty>
  )
}

export default EmptyState