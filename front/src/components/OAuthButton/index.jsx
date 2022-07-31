import React from 'react'

import { Button } from './style';

const googleImg = 'https://t.ctcdn.com.br/P7-_JvQTS4U7-if6zHyXjyMiNQ8=/400x400/smart/i606944.png';
const twitchImg = 'https://pbs.twimg.com/profile_images/1450901581876973568/0bHBmqXe_400x400.png'

const OAuthButton = ({ provider, onClick }) => {
    const img = provider === 'google' ? googleImg : twitchImg;
    return (
        <Button onClick={onClick} provider={provider}>
            <img src={img} alt={provider} width={40} />
            <span>{provider}</span>
        </Button>
    )
}

export default OAuthButton