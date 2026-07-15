import AppKit
import Foundation

let fileManager = FileManager.default
let root = URL(fileURLWithPath: fileManager.currentDirectoryPath)
    .appendingPathComponent("docs/strategy/action-6-app-store-story-2026-07-14")
let imageURLs = [
    "01-daily-observation.png",
    "02-see-your-chart.png",
    "03-backup-choice.png",
    "04-pattern-developed.png",
    "05-completed-charts.png",
    "06-ready-to-export.png",
].map { root.appendingPathComponent("drafts").appendingPathComponent($0) }

let labels = [
    "1 · Daily observation",
    "2 · Chart takes shape",
    "3 · Backup choice",
    "4 · Pattern context",
    "5 · Completed charts",
    "6 · Export",
]

let columns = 3
let rows = 2
let cardWidth: CGFloat = 396
let imageHeight: CGFloat = 860
let labelHeight: CGFloat = 54
let gap: CGFloat = 24
let margin: CGFloat = 32
let canvasWidth = margin * 2 + cardWidth * CGFloat(columns) + gap * CGFloat(columns - 1)
let canvasHeight = margin * 2 + (imageHeight + labelHeight) * CGFloat(rows) + gap * CGFloat(rows - 1)

guard let bitmapContext = CGContext(
    data: nil,
    width: Int(canvasWidth),
    height: Int(canvasHeight),
    bitsPerComponent: 8,
    bytesPerRow: Int(canvasWidth) * 4,
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
) else {
    fatalError("Could not create contact-sheet graphics context")
}

NSGraphicsContext.saveGraphicsState()
let context = NSGraphicsContext(cgContext: bitmapContext, flipped: false)
NSGraphicsContext.current = context

NSColor(calibratedWhite: 0.965, alpha: 1).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight)).fill()

let labelStyle = NSMutableParagraphStyle()
labelStyle.alignment = .center
let labelAttributes: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 22, weight: .semibold),
    .foregroundColor: NSColor(calibratedRed: 0.25, green: 0.23, blue: 0.22, alpha: 1),
    .paragraphStyle: labelStyle,
]

for (index, imageURL) in imageURLs.enumerated() {
    guard let image = NSImage(contentsOf: imageURL) else {
        fatalError("Could not load \(imageURL.path)")
    }

    let column = index % columns
    let row = index / columns
    let x = margin + CGFloat(column) * (cardWidth + gap)
    let top = canvasHeight - margin - CGFloat(row) * (imageHeight + labelHeight + gap)
    let imageRect = NSRect(x: x, y: top - imageHeight, width: cardWidth, height: imageHeight)
    let labelRect = NSRect(x: x, y: imageRect.minY - labelHeight, width: cardWidth, height: labelHeight - 8)

    NSColor.white.setFill()
    NSBezierPath(roundedRect: imageRect.insetBy(dx: -4, dy: -4), xRadius: 12, yRadius: 12).fill()
    image.draw(in: imageRect, from: .zero, operation: .copy, fraction: 1)
    labels[index].draw(in: labelRect, withAttributes: labelAttributes)
}

NSGraphicsContext.restoreGraphicsState()

guard
    let cgImage = bitmapContext.makeImage(),
    let bitmap = NSBitmapImageRep(cgImage: cgImage).representation(using: .png, properties: [:])
else {
    fatalError("Could not encode contact sheet")
}

let outputURL = root.appendingPathComponent("drafts/contact-sheet.png")
try bitmap.write(to: outputURL)
print("Wrote \(outputURL.path)")
