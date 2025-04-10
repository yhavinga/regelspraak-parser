from setuptools import setup, find_packages

setup(
    name="regelspraak",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "antlr4-python3-runtime",
    ],
    python_requires=">=3.7",
) 