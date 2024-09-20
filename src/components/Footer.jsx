import React from 'react'
import { SocialIcon } from 'react-social-icons'

const Footer = () => {
  return (
    <div className="w-screen h-40 bg-slate-400 dark:bg-slate-700 items-center justify-center content-center">
      <div className = "inline-flex divide-x divide-solid divide-black dark:divide-white space-x-4">
        <div>
          <SocialIcon network="linkedin" bgColor='gray' url="https://www.linkedin.com/in/derrickeberlein/"/>
          <SocialIcon network="github" bgColor='gray' url="https://github.com/ReverendTrivium/honkai-star-rails-web-app"/>
          <SocialIcon network="mailto" bgColor='gray' onClick={() => window.location = 'mailto:derrickeberlein@gmail.com'}/>
        </div>
        <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
          {/* &nbsp;&nbsp;&nbsp; <div className="h-full w-1 bg-white"></div> &nbsp;&nbsp;&nbsp; */}
          <SocialIcon network="github" bgColor='gray' url="https://github.com/yuko1101/starrail.js"/>
          <SocialIcon network="github" bgColor='gray' url="https://github.com/Dimbreath/StarRailData"/>
        </div>  
      </div>
      <div className="text-sm text-black dark:text-white">
        <P></P>
        <p>Jarilo.dev is not affiliated with HoYoverse.</p>
        <p>Honkai Star Rails, game content and all assets are trademarks and copyrights of HoYoverse.</p>
      </div>
    </div>
  )
}

export default Footer