# Apex Wallet

Build a complete, production-quality crypto wallet web application UI.

This is NOT a landing page, NOT a marketing website, and NOT a generic admin dashboard.

The application itself is the product.

The entire page should feel like a premium next-generation self-custody crypto wallet: futuristic, minimal, highly polished, immersive, fast, secure, and designed for daily use.

Product vision

Create a modern multi-chain crypto wallet comparable in product depth to wallets such as Phantom, Rabby, MetaMask, Backpack, Zerion, or Trust Wallet, but with a much more premium and futuristic visual identity.

The wallet should feel like a financial operating system for crypto rather than a browser extension.

The user should be able to:

View total portfolio balance

View wallet performance

Browse assets and token balances

Open individual asset pages

Send crypto

Receive crypto

Swap tokens

Bridge assets between chains

Buy crypto

Manage multiple wallets/accounts

View NFTs

View transaction history

Inspect individual transactions

Switch networks

Manage connected apps

Manage security settings

Manage wallet preferences

Search assets and transactions

Copy wallet addresses

Hide/show balances

View market price changes

Manage favorite assets

For now this is frontend/UI only.

Do NOT implement real blockchain transactions or real wallet key management unless mock logic is necessary for interaction.

However, the interface should behave like a real application.

Primary layout

Desktop-first responsive web app.

The screen should contain only the wallet application.

Remove any landing-page elements such as:

marketing navbar

hero section

testimonials

pricing

footer

feature marketing blocks

Use a full-screen application shell.

Structure:

Left sidebar

Create a compact premium navigation sidebar.

Include:

Wallet / Portfolio

Assets

Activity

Swap

Bridge

NFTs

Apps / Connections

Bottom area:

Settings

Network selector

Current account/profile

The sidebar should feel lightweight and modern.

Use icons with restrained labels.

Allow the sidebar to collapse into icon-only mode.

Main content area

The main area should change depending on the selected section.

Keep layouts spacious.

Avoid excessive card grids.

Do not make everything a bordered rectangle.

Use visual hierarchy, typography, spacing, soft surfaces, gradients, and subtle separation instead.

Portfolio / Wallet home

This is the most important screen.

At the top show:

Current wallet/account

Example:
Main Wallet

Shortened address:
0x71F4...92A8

Actions:

copy address

open QR

account switcher

Show the total portfolio value prominently.

Example:
$24,892.41

Below it show:

+$1,248.21
+5.28%

Use green only where financially meaningful.

Provide privacy mode to hide the balance.

Portfolio graph

Create an elegant interactive portfolio chart.

Time periods:

1D

1W

1M

3M

1Y

ALL

Hovering the chart should reveal:

date/time

portfolio value

gain/loss

The graph should animate smoothly when switching time periods.

Do not make it look like a stock trading terminal.

Keep it clean and premium.

Primary wallet actions

Provide four visually prominent actions:

Send

Receive

Swap

Buy

Optionally include Bridge as a secondary action.

Use elegant icon buttons with microinteractions.

Asset list

Below the portfolio overview create a high-quality token list.

Columns:

Asset
Price
24h
Balance
Value

Example assets:

Ethereum
ETH
$4,231.18
+2.41%
2.842 ETH
$12,025.61

Solana
SOL
$187.42
+5.18%
38.21 SOL
$7,161.31

USDC
USDC
$1.00
0.01%
$3,920.24
$3,920.24

Bitcoin
BTC
$118,420
-0.82%
0.0151 BTC
$1,785.14

Include recognizable token icons.

Rows should be clickable.

On hover:

subtle background highlight

reveal quick actions

animate slightly

Allow:

search

filter by chain

hide low-balance assets

Asset details

Clicking an asset should open a detailed asset view.

Include:

asset icon

asset name

ticker

current price

24h change

total wallet balance

fiat value

Primary actions:

Send

Receive

Swap

Create a price chart with multiple ranges.

Below it show wallet activity for this asset.

Show:

Transaction type
Date
Amount
Fiat value
Status

Examples:
Received
Sent
Swapped
Bridge
Contract interaction

Send flow

Build a realistic multi-step send experience.

Prefer a modal, drawer, or focused transaction panel rather than navigating away from the wallet unnecessarily.

Step 1:
Choose asset

Step 2:
Enter recipient

Fields:

wallet address

ENS/domain where appropriate

Include:

paste button

QR scan affordance

address book button

Validate the address visually.

Step 3:
Enter amount

Show:

token amount

fiat equivalent

MAX button

available balance

Step 4:
Transaction review

Show:

asset

recipient

network

amount

estimated network fee

total

estimated arrival

Primary button:
Confirm Send

Create realistic UI states:

loading

success

failure

Success state should show:
Transaction sent

With:

transaction hash

copy

view explorer

Done

Receive flow

Create a clean receive modal.

Show:

Wallet/account
Selected network
QR code
Full wallet address

Actions:

Copy address

Share

Include warning text:
Only send supported assets on the selected network.

Allow changing the receiving network.

Swap

Build a premium token swap interface.

Two token selectors:

You pay
You receive

Include:

token

chain

balance

amount

fiat equivalent

Controls:

reverse tokens

MAX

Below show:

Rate
Price impact
Network fee
Route
Minimum received

Add settings for:

slippage

transaction deadline

Primary action:
Review Swap

Create loading route state and final confirmation state.

The swap UI should feel integrated into the wallet rather than like a third-party widget.

Bridge

Create a dedicated cross-chain bridge interface.

Fields:

From:

network

token

amount

To:

destination network

destination token

Show:

Estimated receive amount
Bridge provider / route
Bridge fee
Network fees
Estimated time

Include a visual connection between source and destination chains.

Buy crypto

Create a polished fiat onboarding panel.

Include:

Amount in fiat
Currency selector
Asset to receive
Network
Payment method

Example payment methods:

Card

Apple Pay

Bank transfer

Use mock providers if needed.

Activity

Create a full transaction history page.

Filters:

All

Sent

Received

Swaps

Bridges

Contract interactions

Allow filtering by:

asset

network

date

Each transaction row should contain:

Icon
Type
Asset
Amount
Wallet / counterparty
Network
Date
Status

Clicking a transaction opens a detail drawer.

Transaction details:

Status
Type
Amount
Network
From
To
Network fee
Transaction hash
Timestamp

Provide:
View on explorer

NFTs

Create an NFT collection screen.

Use a premium gallery layout.

Sections:

Collected
Hidden

Each NFT card can contain:

artwork

collection

token name

floor price if available

Clicking an NFT opens a detailed preview.

Avoid making NFTs visually dominate the financial parts of the wallet.

Multiple accounts

Support multiple wallet accounts.

Account switcher should show:

Main Wallet
Trading
Cold Storage
DeFi

Each account has:

Name
Avatar / generated identity
Shortened address
Balance

Allow:

Create account

Import wallet

Rename

Copy address

For UI-only implementation, these can use mock data.

Networks

Support multiple chains visually.

Example networks:

Ethereum
Solana
Base
Arbitrum
Optimism
Polygon
BNB Chain
Avalanche

Create a network selector.

Allow:

All Networks

individual network

Display chain icons where relevant.

Connected apps

Create an Apps / Connections section.

Show connected dApps with:

icon

application name

URL

connected account

network

last used

Actions:
Disconnect

Example:
Uniswap
Aave
Jupiter
OpenSea

Settings

Create a complete settings area.

Sections:

General
Security
Networks
Address Book
Connected Apps
Preferences

General

Currency:
USD

Language:
English

Theme:
Dark / System

Security

Include UI for:

Auto-lock
Require confirmation for transactions
Trusted addresses
Hide balances

Create a strong security-focused visual hierarchy.

Do NOT expose mock private keys directly on the main settings page.

A separate sensitive action can exist:

Reveal recovery phrase

This action should have warning states and confirmation steps, but do not implement real seed phrases.

Address book

Users can save:

Name
Wallet address
Network

Example:
Treasury
Alice
Exchange

Search

Create global search.

Keyboard shortcut:
Cmd/Ctrl + K

Search should find:

tokens

wallet accounts

transactions

settings

actions

Make the command palette feel fast and premium.

Interaction design

The application should feel alive.

Use meaningful microinteractions.

Examples:

buttons slightly compress on click

wallet balance smoothly counts/animates

charts animate on period changes

token rows react subtly on hover

modals use smooth spring transitions

drawers slide naturally

dropdowns fade and scale

copied address shows temporary success feedback

transaction success includes subtle premium animation

skeleton loading states

smooth tab transitions

Animations should be sophisticated but restrained.

Do NOT create excessive glowing, floating, or bouncing effects.

Visual design

Design direction:

Future-modern crypto interface.

Premium.
Dark.
Minimal.
High contrast.
Slightly experimental.
Financial.
Trustworthy.
Technical.
Elegant.

Avoid the cliché "crypto neon casino" look.

Do not overuse purple neon.

Background

Use a deep near-black background.

Possible tonal direction:

#08090C
#0B0D10
#101217

Use subtle layered gradients.

Very subtle ambient lighting may exist behind major portfolio areas.

Surfaces

Panels should use slightly elevated dark surfaces.

Use:

transparency

subtle border highlights

controlled glass effects

soft inner shadows where useful

Do NOT make every component glassmorphic.

Accent

Use one strong contemporary accent color.

Prefer something around:
electric cyan
cool blue
mint-cyan

Accent should be used sparingly for:

selected navigation

main CTA

chart highlights

focus states

Financial gains should remain green.
Financial losses should remain red.

Typography

Use modern clean typography.

Suggested:
Inter
Geist
Manrope

Large balance typography should feel premium and precise.

Use tabular numerals where appropriate.

Corners

Use moderate rounded corners.

Avoid giant rounded rectangles everywhere.

Shadows

Soft and subtle.

No huge drop shadows.

UX principles

Prioritize:

Security

Clarity

Speed

Portfolio visibility

Transaction confidence

The user should always understand:

which wallet they are using

which chain they are using

what asset they are transacting

how much they are sending

what the network fee is

what will happen after confirmation

Responsive behavior

Desktop should feel like a full crypto operating system.

Tablet:
Sidebar becomes compact.

Mobile:
Use bottom navigation.

Mobile primary navigation:

Wallet
Swap
Activity
Explore

Additional sections can be under More / Profile.

Mobile transaction flows should use full-screen sheets.

Technical requirements

Use reusable components.

Build clean component architecture.

Use realistic mock data.

Do not hard-code a single static screenshot.

All main interactions should work.

Implement:

navigation

modals

drawers

dropdowns

tabs

filters

search

account switching

network switching

privacy balance toggle

mock send flow

mock receive flow

mock swap flow

mock bridge flow

transaction detail panels

Use smooth transitions throughout.

Keep state locally for now.

No backend is required.

No real blockchain connection is required yet.

Important design constraints

Do NOT create:

a generic SaaS dashboard

huge statistic cards everywhere

a marketing landing page

excessive gradients

excessive neon

excessive glassmorphism

crypto casino aesthetics

cluttered interfaces

childish token graphics

giant unnecessary headings

permanent right-side widgets just to fill space

Aim for a wallet someone could realistically use as their primary crypto wallet every day.

The final result should look like a serious venture-backed Web3 product designed by a top-tier product design team in 2026.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ac7c30f0-d8d5-4cc5-94ee-9ad7e1d17efc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
