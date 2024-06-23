CC = gcc
CFLAGS = -Wall
LFLAGS = -L/usr/local/lib
LIBS = -ltoml

SRCS = $(wildcard *.c)
MAIN = fastx 
.PHONY: all clean

all: $(MAIN)
	@echo Build complete!

$(MAIN): $(SRCS)
	$(CC) $(CFLAGS) -o $(MAIN) $(SRCS) $(LFLAGS) $(LIBS)

clean:
	$(RM) $(MAIN)

