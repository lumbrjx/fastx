#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>

#define MAX_PATH_LENGTH 1024

int createDirectoryInCurrentDir(const char *dirName) {
    char cwd[MAX_PATH_LENGTH]; 
    if (getcwd(cwd, sizeof(cwd)) == NULL) { 
        perror("getcwd");
        return 0; 
    }

    size_t requiredSize = snprintf(NULL, 0, "%s/%s", cwd, dirName) + 1; // +1 for null terminator

    if (requiredSize > MAX_PATH_LENGTH) {
        fprintf(stderr, "Directory path is too long\n");
        return 0; 
    }

    char path[MAX_PATH_LENGTH]; 

    snprintf(path, sizeof(path), "%s/%s", cwd, dirName);

    int status = mkdir(path, 0777); 

    if (status == 0) {
        printf("Directory created at %s\n", path);
        return 1; 
    } else {
        perror("mkdir");
        return 0; 
    }
}

