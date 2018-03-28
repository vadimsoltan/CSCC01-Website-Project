import socket

PORT = 5000
DEFAULT_IP = "255.255.255.255"
class Router:
    def __init__(self, in_ip, out_ip):
        self._in_ip = in_ip
        self._out_ip = out_ip
        self._socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self._socket.bind((DEFAULT_IP, PORT))
        
        print ('Bind UDP on 5000...')
        
        while True:
            data, end_ip = self._socket.recvfrom(1024)
            print ('Connected by', end_ip)
            print (data)
            self._socket.sendto(data, end_ip)

if __name__ == "__main__":
    test_router = Router("222.222.222.222", "3.3.3.3")