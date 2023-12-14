'use client';

import styled from '@emotion/styled';
import React from 'react';

const colorProperties = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    tertiary: 'var(--tertiary)',
    quaternary: 'var(--quaternary)',
    quinary: 'var(--quinary)',
    neutral: 'var(--neutral-text)',
    black: 'var(--black)',
    white: 'var(--white)',
    danger: 'var(--danger)',
};

type TextLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700';
type FontColor = keyof typeof colorProperties;

interface HeadingTextProps {
    level: TextLevel;
    fontWeight?: FontWeight;
    className?: string;
    children: React.ReactNode;
    fontColor?: FontColor;
    variant?: 'primary' | 'secondary';
    style?: React.CSSProperties;
    size?: string | number;
}

interface ITextStyleProps {
    as: TextLevel;
    fontWeight?: FontWeight;
    fontColor: FontColor;
    size?: string | number;
}

const Heading = styled.h1<ITextStyleProps>`
    font-weight: ${(props) => props.fontWeight || '400'};
    color: ${({ fontColor }) => colorProperties[fontColor]};
    margin: 0;
    text-decoration: none !important;
    ${({ size }) => `font-size: ${size};` || ''};
`;

const Span = styled.span<ITextStyleProps>`
    color: ${({ fontColor }) => colorProperties[fontColor]};
    margin: 0;
    text-decoration: none !important;
    ${({ size }) => `font-size: ${size};` || ''};
`;

const Paragraph = styled.p<ITextStyleProps>`
    color: ${({ fontColor }) => colorProperties[fontColor]};
    margin: 0;
    text-decoration: none !important;
    ${({ size }) => `font-size: ${size};` || ''};
`;

export const Text: React.FC<HeadingTextProps> = ({
    level,
    fontWeight,
    children,
    className,
    fontColor = 'black',
    size,
    style,
}) => {
    if (level === 'p') {
        return (
            <Paragraph
                style={style}
                as={level}
                fontWeight={fontWeight}
                className={`${className}`}
                fontColor={fontColor as FontColor}
                size={size}
            >
                {children}
            </Paragraph>
        );
    }

    if (level === 'span') {
        return (
            <Span
                style={style}
                as={level}
                fontWeight={fontWeight}
                className={`${className}`}
                fontColor={fontColor as FontColor}
                size={size}
            >
                {children}
            </Span>
        );
    }

    return (
        <Heading
            style={style}
            as={level}
            fontWeight={fontWeight}
            className={`${className}`}
            fontColor={fontColor as FontColor}
            size={size}
        >
            {children}
        </Heading>
    );
};
