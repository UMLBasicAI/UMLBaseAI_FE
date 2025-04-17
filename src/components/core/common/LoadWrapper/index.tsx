import { useEffect, useRef } from "react";
type LoadWrapperProps = {
    onLoad: () => void;
    isLoading?: boolean;
    children: React.ReactNode;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}
const LoadWrapper = ({ onLoad, children, scrollContainerRef }: LoadWrapperProps) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!onLoad || !scrollContainerRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoad();
                }
            },
            {
                root: scrollContainerRef.current, // Theo dõi vùng cuộn thay vì viewport
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => { containerRef.current && observer.unobserve(containerRef.current) };
    }, [onLoad, scrollContainerRef]); // Dependency đã được tối ưu để tránh gọi lại vô tận


    return <div ref={containerRef}>{children}</div>;
};

export default LoadWrapper;

