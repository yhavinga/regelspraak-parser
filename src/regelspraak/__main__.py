import sys

# Ensure the package is runnable
if __package__ is None and not hasattr(sys, 'frozen'):
    # direct execution: adjust path
    import os.path
    path = os.path.realpath(os.path.abspath(__file__))
    sys.path.insert(0, os.path.dirname(os.path.dirname(path)))

from regelspraak.cli import cli

if __name__ == '__main__':
    cli() 