import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useState } from "react";

export default function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [exportedImage, setExportedImage] = useState(null);
	const [gridSize, setGridSize] = useState(16); // Default 16x16 grid
	const [color, setColor] = useState("#000000"); // Default black
	const [cells, setCells] = useState(
		Array(gridSize * gridSize).fill("#ffffff")
	);
	const [tool, setTool] = useState("brush"); // 'brush' or 'eraser'
	const [isDrawing, setIsDrawing] = useState(false);

	const handleCellClick = (index) => {
		const newCells = [...cells];
		newCells[index] = tool === "brush" ? color : "#ffffff";
		setCells(newCells);
	};

	const handleMouseDown = () => setIsDrawing(true);
	const handleMouseUp = () => setIsDrawing(false);
	const handleMouseEnter = (index) => {
		if (isDrawing) handleCellClick(index);
	};

	const exportAsPNG = async () => {
		const canvasElement = document.querySelector(".canvas-container > div");
		if (!canvasElement) return;

		try {
			const dataUrl = await toPng(canvasElement);
			setExportedImage(dataUrl);
			setIsModalOpen(true);
		} catch (error) {
			console.error("Export failed:", error);
		}
	};

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves canvas
		>
			<div className="min-h-screen bg-gray-100 py-8">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold text-center mb-8 text-indigo-600"
				>
					PixelArt Studio
				</motion.h1>

				<div className="flex justify-center gap-8">
					{/* Tools Panel (we'll add later) */}
					<div className="w-48 bg-white p-4 rounded-lg shadow-md">
						<h2 className="font-bold mb-4 text-gray-700">Tools</h2>

						{/* Color Picker (existing) */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Color Picker
							</label>
							<input
								type="color"
								value={color}
								onChange={(e) => setColor(e.target.value)}
								className="w-full h-10 cursor-pointer"
							/>
						</div>

						{/* Tool Buttons */}
						<div className="flex gap-2 mb-4">
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={() => setTool("brush")}
								className={`p-2 flex-1 rounded ${
									tool === "brush"
										? "bg-indigo-100 text-indigo-600"
										: "bg-gray-100"
								}`}
							>
								Brush
							</motion.button>
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={() => setTool("eraser")}
								className={`p-2 flex-1 rounded ${
									tool === "eraser"
										? "bg-indigo-100 text-indigo-600"
										: "bg-gray-100"
								}`}
							>
								Eraser
							</motion.button>
						</div>

						{/* Grid Size Slider */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Grid Size: {gridSize}x{gridSize}
							</label>
							<input
								type="range"
								min="8"
								max="32"
								step="8"
								value={gridSize}
								onChange={(e) =>
									setGridSize(Number(e.target.value))
								}
								className="w-full"
							/>
						</div>

						{/* Export Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={exportAsPNG}
							className="w-full bg-indigo-600 text-white py-2 rounded mb-2"
						>
							Export PNG
						</motion.button>

						{/* Clear Canvas Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								setCells(
									Array(gridSize * gridSize).fill("#ffffff")
								)
							}
							className="w-full bg-red-500 text-white py-2 rounded"
						>
							Clear Canvas
						</motion.button>
					</div>

					{/* Canvas */}
					<div
						className="canvas-container bg-white p-4 rounded-lg shadow-lg"
						style={{ display: "inline-block" }} // Ensures clean PNG export
					>
						<div className="bg-white p-4 rounded-lg shadow-lg">
							<div
								className="grid gap-0 border border-gray-300"
								style={{
									gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
									width: "500px",
									height: "500px",
								}}
							>
								{Array.from({
									length: gridSize * gridSize,
								}).map((_, i) => (
									<motion.div
										key={i}
										whileHover={{ scale: 1.05 }}
										onMouseDown={() => handleCellClick(i)}
										onMouseEnter={() => handleMouseEnter(i)}
										className="border border-gray-100 cursor-pointer"
										style={{ backgroundColor: cells[i] }}
										animate={{
											scale:
												cells[i] !== "#ffffff"
													? [1, 1.1, 1]
													: 1,
											transition: { duration: 0.3 },
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Preview Modal */}
			{isModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
					onClick={() => setIsModalOpen(false)}
				>
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						className="bg-white rounded-lg p-6 max-w-md w-full"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-xl font-bold mb-4">
							Your Pixel Art
						</h2>
						<img
							src={exportedImage}
							alt="Exported Art"
							className="w-full mb-4 border"
						/>
						<div className="flex gap-2">
							<a
								href={exportedImage}
								download="pixel-art.png"
								className="flex-1 bg-indigo-600 text-white py-2 text-center rounded"
							>
								Save
							</a>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsModalOpen(false)}
								className="flex-1 bg-gray-500 text-white py-2 rounded"
							>
								Close
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
}
