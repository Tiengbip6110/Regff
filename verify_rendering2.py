from playwright.sync_api import sync_playwright

def verify_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Navigate to the local index.html file
        page.goto("file:///app/index.html", wait_until="networkidle")

        # Take a screenshot
        page.screenshot(path="/home/jules/verification/index_local2.png", full_page=True)
        print("Screenshot saved to /home/jules/verification/index_local2.png")

        browser.close()

if __name__ == "__main__":
    verify_page()
