export function AiLoaderBar() {
  return (
    <div className="w-full h-1 bg-muted rounded overflow-hidden">
      <div
        className="h-full bg-primary animate-[loader_1.2s_ease_infinite]"
      ></div>

      <style>
        {`
        @keyframes loader {
          0% { transform: translateX(-100%); width: 40%; }
          50% { transform: translateX(30%); width: 60%; }
          100% { transform: translateX(100%); width: 40%; }
        }
        `}
      </style>
    </div>
  );
}
