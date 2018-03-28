import socket

PORT = 5000
DEFAULT_IP = "255.255.255.255"

class EndSystem:
    def __init__(self, ip):
        self._ip = ip
        self._socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self._socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        self.send("255.255.255.255",bytes("hello", "utf-8"),0)

    def send(self, ip, data, ttl ):
        self._socket.sendto(data, (ip, PORT))
    
    def recv(self):
        self._socket.recv(1024)
        



if __name__ == "__main__":

    test = EndSystem("1.1.1.1")
    test.send("222.222.222.222", bytes("helloworld", "utf-8"),0)
    while True:
        print(test._socket.recv(1024))