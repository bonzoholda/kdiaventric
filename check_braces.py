
def check_braces(file_path):
    balance = 0
    with open(file_path, 'r') as f:
        for i, line in enumerate(f):
            for char in line:
                if char == '{':
                    balance += 1
                elif char == '}':
                    balance -= 1
            if balance == 0:
                print(f"Line {i+1}: Balance hit zero!")
                # return # Keep going to see if it happens multiple times
    if balance != 0:
        print(f"Final balance: {balance}")

check_braces('src/App.tsx')
