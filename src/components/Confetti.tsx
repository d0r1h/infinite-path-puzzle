import { useEffect, useRef } from 'react';

interface ConfettiPiece {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
}

/**
 * Confetti celebration effect
 * Displays animated confetti when level is complete
 */
export const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const confettiPieces = useRef<ConfettiPiece[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create confetti pieces
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        const pieceCount = 150;

        for (let i = 0; i < pieceCount; i++) {
            confettiPieces.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
            });
        }

        // Play success sound
        playSuccessSound();

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiPieces.current.forEach((piece, index) => {
                // Update position
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.rotation += piece.rotationSpeed;
                piece.vy += 0.1; // Gravity

                // Draw confetti piece
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate((piece.rotation * Math.PI) / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-5, -5, 10, 10);
                ctx.restore();

                // Remove if off screen
                if (piece.y > canvas.height) {
                    confettiPieces.current.splice(index, 1);
                }
            });

            if (confettiPieces.current.length > 0) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animate();

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

/**
 * Play a success sound using Web Audio API
 */
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create a celebratory sound sequence
        const playNote = (frequency: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        // Play a cheerful melody
        const now = audioContext.currentTime;
        playNote(523.25, now, 0.15); // C5
        playNote(659.25, now + 0.1, 0.15); // E5
        playNote(783.99, now + 0.2, 0.15); // G5
        playNote(1046.50, now + 0.3, 0.3); // C6
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}
