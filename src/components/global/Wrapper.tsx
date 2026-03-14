
// interfaces
interface Props {
    width?: number;
    children: React.ReactNode;
}

export default function Wrapper({ children, width = 90 }: Props) {
    return (
        <div
            style={{
                maxWidth: `${width}rem`,
                flex: 1,
            }}
        >
            {children}
        </div>
    )
}