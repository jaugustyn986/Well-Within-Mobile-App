#!/usr/bin/env swift

import AppKit
import Foundation

let canvasWidth = 1320
let canvasHeight = 2868

func usage() -> Never {
  fputs(
    "Usage: render-marketing-frame.swift <native.png> <output.png> <background-hex> <headline> <support-line> [proof-overlay.png]\n" +
    "Use \\n inside the headline argument for a deliberate line break.\n",
    stderr
  )
  exit(2)
}

guard CommandLine.arguments.count == 6 || CommandLine.arguments.count == 7 else { usage() }

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let backgroundHex = CommandLine.arguments[3]
let headline = CommandLine.arguments[4].replacingOccurrences(of: "\\n", with: "\n")
let supportLine = CommandLine.arguments[5]
let proofOverlayURL = CommandLine.arguments.count == 7
  ? URL(fileURLWithPath: CommandLine.arguments[6])
  : nil

func environmentCGFloat(_ name: String, default defaultValue: CGFloat) -> CGFloat {
  guard
    let rawValue = ProcessInfo.processInfo.environment[name],
    let value = Double(rawValue),
    value > 0
  else { return defaultValue }
  return CGFloat(value)
}

func color(_ hex: String) -> NSColor {
  let normalized = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
  guard normalized.count == 6, let value = UInt64(normalized, radix: 16) else {
    fputs("Invalid six-digit hex color: \(hex)\n", stderr)
    exit(2)
  }
  return NSColor(
    calibratedRed: CGFloat((value >> 16) & 0xff) / 255,
    green: CGFloat((value >> 8) & 0xff) / 255,
    blue: CGFloat(value & 0xff) / 255,
    alpha: 1
  )
}

guard let nativeImage = NSImage(contentsOf: inputURL) else {
  fputs("Could not read native screenshot at \(inputURL.path)\n", stderr)
  exit(1)
}

guard let bitmapContext = CGContext(
  data: nil,
  width: canvasWidth,
  height: canvasHeight,
  bitsPerComponent: 8,
  bytesPerRow: canvasWidth * 4,
  space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
) else {
  fputs("Could not allocate output context.\n", stderr)
  exit(1)
}

let context = NSGraphicsContext(cgContext: bitmapContext, flipped: false)

func rectFromTop(x: CGFloat, top: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
  NSRect(
    x: x,
    y: CGFloat(canvasHeight) - top - height,
    width: width,
    height: height
  )
}

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context

color(backgroundHex).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight)).fill()

let headlineParagraph = NSMutableParagraphStyle()
headlineParagraph.lineBreakMode = .byWordWrapping
headlineParagraph.lineSpacing = 2
headlineParagraph.maximumLineHeight = 108

let headlineAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.systemFont(ofSize: 92, weight: .semibold),
  .foregroundColor: color("#3F3A36"),
  .paragraphStyle: headlineParagraph,
  .kern: -1.2,
]

let supportParagraph = NSMutableParagraphStyle()
supportParagraph.lineBreakMode = .byWordWrapping
supportParagraph.maximumLineHeight = 54

let supportAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.systemFont(ofSize: 39, weight: .regular),
  .foregroundColor: color("#5A5550"),
  .paragraphStyle: supportParagraph,
]

NSAttributedString(string: headline, attributes: headlineAttributes).draw(
  in: rectFromTop(x: 104, top: 154, width: 1112, height: 250)
)

NSAttributedString(string: supportLine, attributes: supportAttributes).draw(
  in: rectFromTop(x: 108, top: 428, width: 1104, height: 116)
)

let sourceSize = nativeImage.size
let deviceWidth = environmentCGFloat("MARKETING_DEVICE_WIDTH", default: 1080)
let deviceHeight = deviceWidth * sourceSize.height / sourceSize.width
let deviceRect = rectFromTop(
  x: (CGFloat(canvasWidth) - deviceWidth) / 2,
  top: 606,
  width: deviceWidth,
  height: deviceHeight
)
let devicePath = NSBezierPath(roundedRect: deviceRect, xRadius: 72, yRadius: 72)

NSGraphicsContext.saveGraphicsState()
let shadow = NSShadow()
shadow.shadowColor = color("#3F3A36").withAlphaComponent(0.18)
shadow.shadowBlurRadius = 34
shadow.shadowOffset = NSSize(width: 0, height: -16)
shadow.set()
color("#FDFCFB").setFill()
devicePath.fill()
NSGraphicsContext.restoreGraphicsState()

NSGraphicsContext.saveGraphicsState()
devicePath.addClip()
nativeImage.draw(
  in: deviceRect,
  from: NSRect(origin: .zero, size: sourceSize),
  operation: .copy,
  fraction: 1,
  respectFlipped: true,
  hints: [.interpolation: NSImageInterpolation.high]
)
NSGraphicsContext.restoreGraphicsState()

if let proofOverlayURL {
  guard let proofImage = NSImage(contentsOf: proofOverlayURL) else {
    fputs("Could not read proof overlay at \(proofOverlayURL.path)\n", stderr)
    exit(1)
  }

  let proofWidth = environmentCGFloat("MARKETING_PROOF_WIDTH", default: 610)
  let proofHeight = proofWidth * proofImage.size.height / proofImage.size.width
  let proofRect = rectFromTop(
    x: environmentCGFloat("MARKETING_PROOF_X", default: 614),
    top: environmentCGFloat("MARKETING_PROOF_TOP", default: 1620),
    width: proofWidth,
    height: proofHeight
  )
  let proofPath = NSBezierPath(roundedRect: proofRect, xRadius: 30, yRadius: 30)

  NSGraphicsContext.saveGraphicsState()
  let proofShadow = NSShadow()
  proofShadow.shadowColor = color("#3F3A36").withAlphaComponent(0.22)
  proofShadow.shadowBlurRadius = 28
  proofShadow.shadowOffset = NSSize(width: 0, height: -12)
  proofShadow.set()
  color("#FDFCFB").setFill()
  proofPath.fill()
  NSGraphicsContext.restoreGraphicsState()

  NSGraphicsContext.saveGraphicsState()
  proofPath.addClip()
  proofImage.draw(
    in: proofRect,
    from: NSRect(origin: .zero, size: proofImage.size),
    operation: .copy,
    fraction: 1,
    respectFlipped: true,
    hints: [.interpolation: NSImageInterpolation.high]
  )
  NSGraphicsContext.restoreGraphicsState()

  color("#E7E2DE").setStroke()
  proofPath.lineWidth = 2
  proofPath.stroke()
}

NSGraphicsContext.restoreGraphicsState()

guard let outputImage = bitmapContext.makeImage() else {
  fputs("Could not create output image.\n", stderr)
  exit(1)
}

let bitmap = NSBitmapImageRep(cgImage: outputImage)
guard let png = bitmap.representation(using: .png, properties: [:]) else {
  fputs("Could not encode PNG.\n", stderr)
  exit(1)
}

do {
  try FileManager.default.createDirectory(
    at: outputURL.deletingLastPathComponent(),
    withIntermediateDirectories: true
  )
  try png.write(to: outputURL, options: .atomic)
  print("Wrote \(outputURL.path)")
} catch {
  fputs("Could not write output: \(error)\n", stderr)
  exit(1)
}
