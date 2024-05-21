function ThumbUpCircle({ className, size = '32' }: { size?: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle cx="20" cy="20" r="20" fill="#E1F3D6" />
      <path
        d="M22.6484 11.3594C21.1562 10.9336 19.5977 11.7969 19.1719 13.2891L18.9492 14.0703C18.8047 14.5781 18.543 15.0469 18.1875 15.4375L16.1836 17.6406C15.8359 18.0234 15.8633 18.6172 16.2461 18.9648C16.6289 19.3125 17.2227 19.2852 17.5703 18.9023L19.5742 16.6992C20.125 16.0938 20.5273 15.3711 20.75 14.5859L20.9727 13.8047C21.1133 13.3086 21.6328 13.0195 22.1328 13.1602C22.6328 13.3008 22.918 13.8203 22.7773 14.3203L22.5547 15.1016C22.332 15.8789 21.9805 16.6133 21.5156 17.2695C21.3125 17.5547 21.2891 17.9297 21.4492 18.2422C21.6094 18.5547 21.9297 18.75 22.2812 18.75H27.5C27.8438 18.75 28.125 19.0312 28.125 19.375C28.125 19.6406 27.957 19.8711 27.7188 19.9609C27.4297 20.0703 27.2109 20.3125 27.1367 20.6133C27.0625 20.9141 27.1406 21.2305 27.3438 21.4609C27.4414 21.5703 27.5 21.7148 27.5 21.875C27.5 22.1797 27.2812 22.4336 26.9922 22.4883C26.6719 22.5508 26.4023 22.7734 26.2891 23.082C26.1758 23.3906 26.2266 23.7344 26.4297 23.9922C26.5117 24.0977 26.5625 24.2305 26.5625 24.3789C26.5625 24.6406 26.3984 24.8711 26.1641 24.9609C25.7148 25.1367 25.4727 25.6211 25.6016 26.0859C25.6172 26.1367 25.625 26.1953 25.625 26.2539C25.625 26.5977 25.3438 26.8789 25 26.8789H21.1914C20.6992 26.8789 20.2148 26.7344 19.8047 26.4609L17.3945 24.8555C16.9648 24.5664 16.3828 24.6836 16.0938 25.1172C15.8047 25.5508 15.9219 26.1289 16.3555 26.418L18.7656 28.0234C19.4844 28.5039 20.3281 28.7578 21.1914 28.7578H25C26.3555 28.7578 27.457 27.6797 27.5 26.3359C28.0703 25.8789 28.4375 25.1758 28.4375 24.3828C28.4375 24.207 28.418 24.0391 28.3867 23.875C28.9883 23.418 29.375 22.6953 29.375 21.8828C29.375 21.6289 29.3359 21.3828 29.2656 21.1523C29.7188 20.6914 30 20.0664 30 19.375C30 17.9961 28.8828 16.875 27.5 16.875H23.8945C24.0781 16.4688 24.2344 16.0469 24.3555 15.6172L24.5781 14.8359C25.0039 13.3438 24.1406 11.7852 22.6484 11.3594ZM11.25 17.5C10.5586 17.5 10 18.0586 10 18.75V27.5C10 28.1914 10.5586 28.75 11.25 28.75H13.75C14.4414 28.75 15 28.1914 15 27.5V18.75C15 18.0586 14.4414 17.5 13.75 17.5H11.25Z"
        fill="#44B600"
      />
    </svg>
  )
}

export default ThumbUpCircle