import { useEffect, useState } from 'react';
import TypeIt from 'typeit-react';

export function useAnimatedText() {
    const [text, setText] = useState('');
    console.log()
    const el = (
        <TypeIt options={{ cursor: false }}>{text}</TypeIt>
    );

    return [el, setText];
}