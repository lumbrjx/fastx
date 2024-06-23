#include <stdio.h>
#include "cli_utils.h"


int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: %s <arg1> <arg2> Run fastx -h show for more info.\n", argv[0]);
        return 1;
    }
    sanitize_input(argv[1]);
    sanitize_input(argv[2]);
	process_flags(argv[1],argv[2]);

    return 0;
}
